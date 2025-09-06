// components/Signup.jsx
import React from 'react'
import SignupForm from '../components/core/Auth/SignupForm'

const Signup = () => {
  return (
    <div className='min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8'>
      {/* Background Image */}
      <div className="w-full h-full absolute inset-0">
        <img src="https://images.unsplash.com/photo-1664448003365-e1b05ffd509d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8MTUxfHx8ZW58MHx8fHx8" alt="Signup Background" className="w-full h-full object-cover" />
      </div>
      
      <div className="w-full max-w-4xl">
        
        {/* Signup Form */}
        <div className="flex justify-center">
          <SignupForm />
        </div>
      </div>
    </div>
  )
}

export default Signup
