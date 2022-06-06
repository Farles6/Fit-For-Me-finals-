const router = require("express").Router();
const { checkForAnotherDay, workoutDaysIsCurrent, workoutIsCurrent, currentWorkout, addWorkoutDayExercises, addWorkoutDays, addWorkout, getWorkoutName, getDays, getDaysCurrent } = require('../helpers/workoutHelpers')

module.exports = db => {
	router.get("/", (req, res) => {
	 getWorkoutName()
		.then(response => {
			res.json(response.rows);
		});
	});

	router.get("/days", (req, res) => {
		getDays()
		.then(response => {
			res.json(response.rows);
		});
	});

	router.get("/days/current", (req, res) => {
		const user = Number(req.query.id);
		getDaysCurrent(user)
			.then(response => {
				res.json(response.rows);
			})
			.catch(err => {
				console.log(err);
			});
	});

	router.put("/iscurrent", (req, response) => {
		const body = req.body;
		const isCurrent = body.isCurrent;
		const user = body.userId;
		currentWorkout(user).then(result => {
			const workoutIdRef = result.rows[0].workout_id;
			const workoutDaysId = result.rows[0].id;
			workoutDaysIsCurrent(isCurrent, workoutDaysId).then(result => {
				const day = result.rows[0].day;
				const add = day + 1;
				checkForAnotherDay(workoutIdRef, add)
					.then(result => {
						if (!result.rows[0]) {
							workoutIsCurrent(false, workoutIdRef, user);
							response.json(result);
						} else {
							const newWorkoutDayId = result.rows[0].id;
							workoutDaysIsCurrent(true, newWorkoutDayId);
							response.json(result);
						}
					})
					.catch(err => {
						console.log(err);
					});
			});
		});
	});

	router.post("/new", (req, response) => {
		const workoutData = req.body;
		const userID = workoutData.userId;
		const title = workoutData.title;
		const day = workoutData.day;
		addWorkout(userID, title).then(res => {
			addWorkoutDays(res.rows[0].id, day)
				.then(res => {
					workoutData.workouts.map(ex => {
						addWorkoutDayExercises(
							res.rows[0].id,
							ex.name,
							ex.bodyPart,
							ex.equipment,
							ex.gifUrl
						);
					});
					response.json(res);
				})
				.catch(err => {
					console.log(err);
				});
		});
	});

	// TODO refactor into one route

	router.post("/new/2", (req, response) => {
		const workoutData = req.body;
		const userID = workoutData.userId;
		const title = workoutData.title;
		addWorkout(userID, title).then(res => {
			workoutData.days.map(d => {
				addWorkoutDays(res.rows[0].id, d.day)
					.then(res => {
						d.workouts.workout.map(ex => {
							addWorkoutDayExercises(
								res.rows[0].id,
								ex.name,
								ex.bodyPart,
								ex.equipment,
								ex.gifUrl
							);
						});
						response.json(res);
					})
					.catch(err => {
						console.log(err);
					});
			});
		});
	});
	return router;
};
