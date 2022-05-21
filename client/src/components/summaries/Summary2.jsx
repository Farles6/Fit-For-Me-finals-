import React from "react";
import { WorkoutContext } from "../providers/WorkoutFormProvider";
import { useContext } from "react";
import WorkoutListItem from "../Workout/WorkoutListItem";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Grid,
  FormControl,
  Button,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";

export default function Summary2() {
  const { day1, day2, title, cookies, setTitle, setValue, setDay1, setDay2, setChoice } = useContext(WorkoutContext);

  let navigate = useNavigate()

  const dayInfo1 = day1.workouts.workout.map((work) => {
    return (
      <WorkoutListItem
        type={work.bodyPart}
        name={work.name}
        image={work.gifUrl}
      />
    );
  });

  const dayInfo2 = day2.workouts.workout.map((work) => {
    return (
      <WorkoutListItem
        type={work.bodyPart}
        name={work.name}
        image={work.gifUrl}
      />
    );
  });

  const finalSubmit= () => {
    const options = {
      userId: Number(cookies.id),
      title: title,
      days: [day1, day2],
    };

    axios.post("http://localhost:8080/workouts/new/2", options).then((res) => {
      console.log(res.data);
    });
    setTitle("");
    setValue("");
    setChoice({
      day: 1,
      workout: [],
    });
    setDay1({
      day: 1,
      workout: [],
    });
    setDay2({
      day: 2,
      workout: [],
    });
    navigate('/')
  }

  return (
    <Box sx={{ minWidth: 120 }}>
      <Grid align="center" margin={1}>
        <Typography variant="h2">{title}</Typography>
        <FormControl>
          <Grid container>
            <Grid item xs={12} sm={8} md={3}>
              <Typography variant="h6">day 1</Typography>
              {dayInfo1}
            </Grid>
            <Grid item xs={12} sm={8} md={3}>
            <Typography variant="h6">day 2</Typography>
              {dayInfo2}
            </Grid>
          </Grid>

          <Button variant="contained" onClick={finalSubmit}>Submit</Button>
        </FormControl>
      </Grid>
    </Box>
  );
}