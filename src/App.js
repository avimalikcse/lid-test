import logo from './logo.svg';
import './App.css';
import question from "./question.json";
import React, { useState } from "react";
import { Pagination, Box, Typography, Card, CardContent, Button } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Modal from '@mui/material/Modal';
import { Analytics } from "@vercel/analytics/react"

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const CardComponent = ({ q,index,questionCallback=null }) => {
  const handleOptionChange = (e) => {
    
    if(questionCallback){
      questionCallback(e.target.value === q.solution);
      return;
    }
    if (e.target.value === q.solution) {



      setFeedback("Correct!");
    } else {
      setFeedback(`Incorrect! The correct answer is ${q.solution}`);
    }
  };
  const [feedback, setFeedback] = useState("");





  return (
    <Card key={q.id} sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6">
          {index}. {q.question}
          {q.image !== "-" && (
            <Box sx={{ marginTop: 2 }}>
              <img src={q.image} alt={`Question ${q.num}`} style={{ maxWidth: "100%" }} />
            </Box>
          )}
        </Typography>
        <Box>
          {["a", "b", "c", "d"].map((option) => (
            <Box key={option} sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
              <input
                type="radio"
                id={`${q.id}-${option}`}
                name={`question-${q.id}`}
                value={option}
                onChange={handleOptionChange}
              />
              <label htmlFor={`${q.id}-${option}`} style={{ marginLeft: 8 }}>
                {q[option]}
              </label>
            </Box>
          ))}
        </Box>
        {
          feedback && (
            <Typography variant="body2" color={feedback === "Correct!" ? "green" : "red"} sx={{ marginTop: 1 }}>
              {feedback}
            </Typography>
          )
        }
      </CardContent >
    </Card >
  )
}


const Test = () => {
  const [testQuestions, setTestQuestions] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  React.useEffect(() => {
    const shuffledQuestions = [...question.slice(0,300)].sort(() => 0.5 - Math.random());
    setTestQuestions(shuffledQuestions.slice(0, 33));
  }, []);

  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);

  const handleQuestionCallback = (index, isCorrect) => {
    if (isCorrect) {
      setCorrectAnswers((prev) => [...prev, testQuestions[index]]);
      setIncorrectAnswers((prev) => prev.filter((q) => q.id !== testQuestions[index].id));
    } else {
      setIncorrectAnswers((prev) => [...prev, testQuestions[index]]);
      setCorrectAnswers((prev) => prev.filter((q) => q.id !== testQuestions[index].id));
    }

    console.log("Correct Answers: ", correctAnswers);
    console.log("Incorrect Answers: ", incorrectAnswers);
  };
  


  return (
    <div className="Test">
      {isSubmitted && (
        <Modal
        open={isSubmitted}
       
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h4">Test Results</Typography>
          <Typography variant="h6">Correct Answers: {correctAnswers.length}</Typography>
          <Typography variant="h6">Incorrect Answers: {incorrectAnswers.length}</Typography>
         
        </Box>
        </Modal>
      )}
     
      
      <Box sx={{ padding: 2 }}>

        
        {testQuestions.map((q,index) => (
          <CardComponent key={q.id} index={index} q={q} questionCallback={(answer)=>{handleQuestionCallback(index,answer)}} />
        ))}
        <Button variant='outlined' onClick={()=>setIsSubmitted(true)}>Submit</Button>
      </Box>
    </div>
  );
};



const Questions = () =>{
  const QUESTIONS_PER_PAGE = 30;

  const [page, setPage] = useState(1);

  const handleChange = (event, value) => {
    setPage(value);
  };
  const mainQuestions = question.slice(0, 300);
  const startIndex = (page - 1) * QUESTIONS_PER_PAGE;
  const endIndex = startIndex + QUESTIONS_PER_PAGE;
  const currentQuestions = mainQuestions.slice(startIndex, endIndex)

  return (
    <div className="App">
      <Box sx={{ padding: 2 }}>
        {currentQuestions.map((q) => {
          return <CardComponent
            key={q.id}
            q={q}
            index={q.num}
          />

        })}
        <Pagination
          count={Math.ceil(mainQuestions.length / QUESTIONS_PER_PAGE)}
          page={page}
          onChange={handleChange}
          sx={{ marginTop: 2 }}
        />
      </Box>
    </div>
  );

}
function App() {

  return (
    <Router>
      <Routes>
        <Route path="/questions" element={<Questions />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
  
}


export default App;
