import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-gray-800 shadow-lg sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center space-x-3">
            <svg className="h-6 w-auto fill-current text-white" viewBox="0 0 85 32" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.09 25.799L13.008 19.615L11.91 24.05L10.2 25.799H8.2L11.71 16.706L10.692 13.547L5.143 25.799H2.627L9.152 11.523L7.793 7.999L0.5 25.799H0L8.209 6H10.3L11.617 10.148L12.934 6H15.025L16.342 10.148L17.659 6H19.75L21.067 10.148L22.384 6H24.475L25.792 10.148L27.109 6H29.2L30.517 10.148L31.834 6H33.925L35.242 10.148L36.559 6H38.65L39.967 10.148L41.284 6H43.375L44.692 10.148L46.009 6H48.1L49.417 10.148L50.734 6H52.825L54.142 10.148L55.459 6H57.55L58.867 10.148L60.184 6H62.275L63.592 10.148L64.909 6H67L68.317 10.148L69.634 6H71.725L73.042 10.148L74.359 6H76.45L77.767 10.148L79.084 6H81.175L82.492 10.148L83.809 6H84.5L76.291 25.799H75.791L68.498 7.999L67.139 11.523L73.664 25.799H71.148L65.599 13.547L64.581 16.706L68.091 25.799H66.091L64.381 24.05L63.283 19.615L61.201 25.799H59.201L57.491 24.05L56.393 19.615L54.311 25.799H52.311L50.601 24.05L49.503 19.615L47.421 25.799H45.421L43.711 24.05L42.613 19.615L40.531 25.799H38.531L36.821 24.05L35.723 19.615L33.641 25.799H31.641L29.931 24.05L28.833 19.615L26.751 25.799H24.751L23.041 24.05L21.943 19.615L19.861 25.799H17.861L16.151 24.05L15.053 19.615L12.971 25.799H10.971L9.261 24.05L8.163 19.615L6.081 25.799H4.081L2.371 24.05L1.273 19.615L0.5 21.799V25.799H15.09Z"/>
            </svg>
            <span className="text-lg font-bold text-white">Champion Explorer</span>
          </Link>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/your-username/league"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
