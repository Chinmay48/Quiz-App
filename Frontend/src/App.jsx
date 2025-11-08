import { useState } from 'react'
import { Login } from './pages/auth/Login'
import {createBrowserRouter,RouterProvider} from "react-router-dom"
import { FacultyDashboard } from './pages/faculty/FacultyDashboard'
import { CreateQuiz } from './pages/faculty/CreateQuiz'
import { FacultyHome } from './pages/faculty/FacultyHome'
import { UpdateQuiz } from './pages/faculty/UpdateQuiz'
import { StudentDashboard } from './pages/student/StudentDashboard'
import { StudentHome } from './pages/student/StudentHome'
import { ExamAttemptPage } from './pages/student/ExamAttemptPage'
import { QuizResultPage } from './pages/student/QuizResultPage'
import { FacultyProfile } from './pages/faculty/FacultyProfile'
const App=()=>{
  const router=createBrowserRouter([
   {
    path:"/",
    element:<Login/>,
   },
   {
    path:"/faculty",
    element:<FacultyDashboard/>,
    children:[
      {
        path:"create_quiz",
        element:<CreateQuiz/>
      },
      {
        index:true,
        element:<FacultyHome/>
      },{
        path:"update/:id",
        element:<UpdateQuiz/>
      },{

        path:"faculty_profile",
        element:<FacultyProfile/>
      }
    ]
   },
   {
    path:"/student",
    element:<StudentDashboard/>,
    children:[
      {
        index:true,
        element:<StudentHome/>
      },
      {
        path:"quiz/result/:quizId",
        element:<QuizResultPage/>
      }

    ]
   },{
      path: "/student/attempt/:quizId",
      element: <ExamAttemptPage />,
    },

  ])
  return <RouterProvider router={router}/>
}

export default App
