import React from 'react';
import {useNavigate} from 'react-router-dom';

const InterestForm = () => {
  const navigate = useNavigate();
    return(
        <div className="w-full h-full bg-white px-4py-20  border-2 border-gray">
        <h1 className="text-5xl font-bold">Setup Profile!</h1>
        <p className="font-medium text-lg text-gray-500 mt-4">
          Let us know - for better understanding!
        </p>
        <div className="mt-8 ">
          
            <label className="text-lg font-medium">What is your name ?</label>
            <input
              className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
              placeholder="Name will be displayed socially"
            />
         
          <div className="mt-8 ">
            <label className="text-lg font-medium">What is you age ?</label>
            <input
              className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
              placeholder="Age"
              type="password"
            />
          </div>
          <div className="mt-8 ">
            <label className="text-lg font-medium">Gender</label>
            <input
              className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
              placeholder="Male / Female / Others"
              type="password"
            />
          </div>
          <div className="mt-8 ">
            <label className="text-lg font-medium">How did you get to know ?</label>
            <input
              className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
              placeholder="----"
              type="password"
            />
          </div>
          {/* <div className="mt-8 flex justify-between items-center">
            <div>
              <input type="checkbox" id="remenber" />
              <label className="ml-2 font-medium text-base" for="remember">
                remember for now
              </label>
            </div>
            <button className="font-medium text-base text-violet">
              Forget Password
            </button>
          </div> */}
          <div className="mt-8 flex flex-col gap-y-4">
            <button className="active:scale-[.98] acitve:duration-75 hover:scale-[1.01] ease-in-out transition-all py-3 rounded-xl bg-gradient-to-tr from-violet-500 to-pink-500 text-white text-lg font-bold" onClick={() => {navigate('/Dashboard')}}>
              Submit
            </button>
            {/* <button className="flex rounded-xl py-3 border-2 border-gray-100 items-center justify-center gap-2 active:scale-[.98] acitve:duration-75 hover:scale-[1.01] ease-in-out transition-all">
              Sign Up
            </button> */}
            <div className="mb-2 flex justify-center items-center">
            {/* <p className="font-medium text-base">Already have an account?</p> */}
            
          </div>
          </div>
          {/* <div className="mt-8 flex justify-center items-center">
            <p className="font-medium text-base">Don't have an account?</p>
            <button className="text-violet-500 text-base font-medium ml-2">
              Sign up
            </button>
          </div> */}
        </div>
      </div>
    )
}

export default InterestForm;