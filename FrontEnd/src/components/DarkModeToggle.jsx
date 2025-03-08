import React, { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
  )

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className='p-2 sm:p-2.5 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded flex items-center gap-1 sm:gap-2 text-sm sm:text-base'
    >
      {darkMode ? <Sun size={16} /> : <Moon size={16} />}
      <span className="hidden sm:inline">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
    </button>
  )
}

export default DarkModeToggle
