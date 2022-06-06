const db = require("../configs/db.config");

const addWorkout = (userID, title) => {
  const queryString = `
  INSERT INTO workouts (user_id, name, is_current)
  VALUES($1, $2, $3)
  RETURNING *
  `;
  return db.query(queryString, [userID, title, true]);
};

const addWorkoutDays = (workoutID, day) => {
  const isDay = day => {
    if (day !== 1) {
      return false;
    } else {
      return true;
    }
  };
  const queryString = `
  INSERT INTO workout_days (workout_id, day, is_current)
  VALUES($1, $2, $3)
  RETURNING *
  `;
  return db.query(queryString, [workoutID, day, isDay(day)]);
};
const addWorkoutDayExercises = (
  workoutDayID,
  exercise,
  bodyPart,
  equipment,
  image
) => {
  const priority = bodyPart => {
    switch (bodyPart) {
      case "chest":
      case "back":
      case "upper legs":
        return 1;
      case "shoulders":
      case "upper arms":
        return 2;
      case "waist":
        return 3;
    }
  };

  const queryString = `
  INSERT INTO workout_day_exercises (workout_day_id, name, priority, type, equipment, image)
  VALUES($1, $2, $3, $4, $5, $6)
  RETURNING *
  `;
  return db.query(queryString, [
    workoutDayID,
    exercise,
    priority(bodyPart),
    bodyPart,
    equipment,
    image,
  ]);
};
const currentWorkout = user => {
  const queryString = `
    SELECT 
    workout_days.id, workout_days.workout_id
    FROM workouts
    JOIN workout_days ON workout_days.workout_id = workouts.id
    WHERE workouts.user_id = $1 
    AND workout_days.is_current = true;
`;
  return db.query(queryString, [user]);
};

const workoutIsCurrent = (isCurrent, workoutId, user) => {
  const queryString = `
  UPDATE workouts
  SET is_current = $1
  FROM workout_days
  WHERE workout_days.id = $2
  AND user_id = $3
  RETURNING *;
  `;
  return db.query(queryString, [isCurrent, workoutId, user]);
};

const workoutDaysIsCurrent = (isCurrent, workoutId) => {
  const queryString = `
  UPDATE workout_days
  SET is_current = $1
  FROM workouts
  WHERE workout_days.id = $2
  RETURNING *;
  `;
  return db.query(queryString, [isCurrent, workoutId]);
};

const checkForAnotherDay = (workoutId, day) => {
  const queryString = `
  SELECT 
  workout_days.day, workout_days.id
  FROM workouts
  JOIN workout_days ON workout_days.workout_id = workouts.id
  WHERE workout_days.workout_id = $1 
  AND workout_days.day = $2
  AND workout_days.is_current = false;
  `;
  return db.query(queryString, [workoutId, day]);
};

const getWorkoutName = () => {
 return db.query(
    `
    SELECT workouts.name as name,
    workouts.is_current as current_workout
    FROM workouts
    WHERE workouts.user_id = 1 
    ORDER BY workouts.id
  `)
}

const getDays = () => {
 return db.query(
    `
  SELECT 
  workout_days.day,
  workout_day_exercises.name as exercise_name,
  type, equipment, image
  FROM workouts
  JOIN workout_days ON workout_days.workout_id = workouts.id
  JOIN workout_day_exercises ON workout_day_exercises.workout_day_id = workout_days.id
  WHERE workouts.user_id = 1 AND workouts.is_current = true
  GROUP BY workouts.id, workout_days.id, workout_day_exercises.id
  ORDER BY workout_days.day, workout_day_exercises.priority, workout_day_exercises.type;
  `
  )
}

const getDaysCurrent = (user) => {
  return 	db.query(
    `
  SELECT 
  workout_day_exercises.name as exercise_name,
  workout_days.day as day,
  priority, type, equipment, image, workouts.name
  FROM workouts
  JOIN workout_days ON workout_days.workout_id = workouts.id
  JOIN workout_day_exercises ON workout_day_exercises.workout_day_id = workout_days.id
  WHERE workouts.user_id = ${user} AND workouts.is_current = true AND workout_days.is_current = true
  GROUP BY workouts.id, workout_days.id, workout_day_exercises.id
  ORDER BY workout_days.day, workout_day_exercises.priority, workout_day_exercises.type;
  `
  )
}

module.exports = { checkForAnotherDay, workoutDaysIsCurrent, workoutIsCurrent, currentWorkout, addWorkoutDayExercises, addWorkoutDays, addWorkout, getWorkoutName, getDays, getDaysCurrent };
