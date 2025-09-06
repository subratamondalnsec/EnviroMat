import { Link, useNavigate } from "react-router-dom"
import { HiOutlineHome } from "react-icons/hi"

function Error() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-br from-richblack-900 via-richblack-800 to-richblack-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative inline-block">
            {/* Large 404 Text */}
            <h1 className="text-8xl sm:text-9xl md:text-[12rem] lg:text-[15rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] leading-none select-none">
              404
            </h1>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce opacity-80"></div>
            <div className="absolute -top-6 -right-6 w-6 h-6 bg-pink-400 rounded-full animate-pulse opacity-70"></div>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-blue-400 rounded-full animate-bounce delay-300 opacity-60"></div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8 space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg sm:text-xl text-richblack-300 max-w-2xl mx-auto leading-relaxed">
            The page you're looking for seems to have wandered off into the digital void. 
            Don't worry, even the best explorers sometimes take a wrong turn!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link to="/">
            <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ease-in-out">
              <HiOutlineHome className="mr-2 text-xl group-hover:animate-pulse" />
              Back to Home
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
            </button>
          </Link>
          
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-richblack-300 border-2 border-richblack-600 rounded-xl hover:border-richblack-400 hover:text-white transition-all duration-200 ease-in-out"
          >
            Go Back
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="relative">
          {/* Search Suggestion */}
          <div className="bg-richblack-800 border border-richblack-700 rounded-2xl p-6 sm:p-8 shadow-2xl max-w-md mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Need Help?</h3>
            <p className="text-richblack-400 text-sm leading-relaxed">
              Try searching for what you need or browse our course catalog to discover amazing learning opportunities.
            </p>
          </div>

          {/* Background Pattern */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#1FA2FF]/10 to-[#A6FFCB]/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Error