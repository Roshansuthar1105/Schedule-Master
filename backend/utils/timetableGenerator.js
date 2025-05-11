const Timetable = require('../models/Timetable');
const Class = require('../models/Class');
const Teacher = require('../models/Teacher');
const TimeSlot = require('../models/TimeSlot');
const Subject = require('../models/Subject');

/**
 * Generate a timetable for all classes
 * @returns {Promise<Object>} Result of timetable generation
 */
exports.generateTimetable = async () => {
  try {
    // Clear existing timetable
    await Timetable.deleteMany({});

    // Get all classes, teachers, subjects, and time slots
    const classes = await Class.find().populate('subjects');
    const teachers = await Teacher.find().populate('subjects').populate('user', 'name');
    const timeSlots = await TimeSlot.find().sort('order');
    
    // Days of the week
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    // Track teacher assignments to avoid conflicts
    const teacherAssignments = {};
    days.forEach(day => {
      teacherAssignments[day] = {};
      timeSlots.forEach(slot => {
        teacherAssignments[day][slot._id] = null;
      });
    });

    // Track class assignments to avoid conflicts
    const classAssignments = {};
    classes.forEach(cls => {
      classAssignments[cls._id] = {};
      days.forEach(day => {
        classAssignments[cls._id][day] = {};
        timeSlots.forEach(slot => {
          classAssignments[cls._id][day][slot._id] = null;
        });
      });
    });

    // Track teacher hours per day to ensure even distribution
    const teacherHoursPerDay = {};
    teachers.forEach(teacher => {
      teacherHoursPerDay[teacher._id] = {};
      days.forEach(day => {
        teacherHoursPerDay[teacher._id][day] = 0;
      });
    });

    // Create timetable entries for each class, day, and time slot
    const timetableEntries = [];
    
    // First, add break slots
    for (const cls of classes) {
      for (const day of days) {
        for (const slot of timeSlots) {
          if (slot.isBreak) {
            const timetableEntry = {
              class: cls._id,
              day,
              timeSlot: slot._id,
              isBreak: true,
              breakName: slot.breakName
            };
            
            timetableEntries.push(timetableEntry);
            classAssignments[cls._id][day][slot._id] = 'break';
          }
        }
      }
    }

    // Then, assign subjects and teachers to non-break slots
    for (const cls of classes) {
      // Get subjects for this class
      const classSubjects = cls.subjects;
      
      if (classSubjects.length === 0) {
        continue; // Skip if no subjects assigned to this class
      }

      // Distribute subjects evenly across the week
      for (const day of days) {
        for (const slot of timeSlots) {
          // Skip if this is a break or already assigned
          if (slot.isBreak || classAssignments[cls._id][day][slot._id] !== null) {
            continue;
          }

          // Find a subject and teacher for this slot
          let assigned = false;
          
          // Try each subject
          for (let i = 0; i < classSubjects.length && !assigned; i++) {
            const subject = classSubjects[i];
            
            // Find teachers who can teach this subject
            const eligibleTeachers = teachers.filter(teacher => 
              teacher.subjects.some(s => s._id.toString() === subject._id.toString())
            );
            
            if (eligibleTeachers.length === 0) {
              continue; // No teachers available for this subject
            }
            
            // Try each eligible teacher
            for (let j = 0; j < eligibleTeachers.length && !assigned; j++) {
              const teacher = eligibleTeachers[j];
              
              // Check if teacher is available at this time
              if (teacherAssignments[day][slot._id] === teacher._id.toString()) {
                continue; // Teacher already assigned at this time
              }
              
              // Check if teacher has reached max hours for the day
              if (teacherHoursPerDay[teacher._id][day] >= teacher.maxHoursPerDay) {
                continue; // Teacher has reached max hours
              }
              
              // Assign this teacher and subject
              const timetableEntry = {
                class: cls._id,
                day,
                timeSlot: slot._id,
                subject: subject._id,
                teacher: teacher._id,
                isBreak: false
              };
              
              timetableEntries.push(timetableEntry);
              classAssignments[cls._id][day][slot._id] = subject._id;
              teacherAssignments[day][slot._id] = teacher._id;
              teacherHoursPerDay[teacher._id][day]++;
              assigned = true;
            }
          }
        }
      }
    }

    // Save all timetable entries to the database
    await Timetable.insertMany(timetableEntries);

    return {
      success: true,
      message: 'Timetable generated successfully',
      count: timetableEntries.length
    };
  } catch (err) {
    return {
      success: false,
      message: 'Error generating timetable',
      error: err.message
    };
  }
};
