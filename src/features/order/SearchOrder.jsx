//import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SearchOrder() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  function handleSubmit(e) {
    e.preventDefault()
    if (!query) return
    navigate(`/order/${query}`)
    setQuery('')
  }
  return (
    <form onSubmit={handleSubmit}>
      <input
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search order #"
        value={query}
        className="duration:300 w-28 rounded-full px-4 py-2 text-sm transition-all placeholder:text-stone-400 focus:w-44 focus:outline-none focus:ring focus:ring-yellow-500 focus:ring-opacity-50 sm:w-64 sm:focus:w-72"
      />
    </form>
  )
}
