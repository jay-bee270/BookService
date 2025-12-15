"use client"

import { Select } from "antd"
import { BOOK_GENRES } from "../../utils/genres"
import "./GenreFilter.css"

const { Option } = Select

const GenreFilter = ({
  selectedGenres = [],
  onGenreChange,
  mode = "multiple",
  placeholder = "Select genres...",
  showAllOption = true,
  size = "default",
}) => {
  const handleChange = (value) => {
    onGenreChange && onGenreChange(value)
  }

  // For single mode, ensure we handle the value correctly
  const currentValue = mode === "multiple" ? selectedGenres : selectedGenres

  return (
    <div className="genre-filter">
      <Select
        mode={mode === "multiple" ? "multiple" : undefined}
        placeholder={placeholder}
        value={currentValue}
        onChange={handleChange}
        style={{ width: "100%" }}
        size={size}
        allowClear
        showSearch={mode === "multiple"}
        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      >
        {showAllOption && mode !== "multiple" && <Option value="all">All Genres</Option>}
        {BOOK_GENRES.map((genre) => (
          <Option key={genre} value={genre}>
            {genre}
          </Option>
        ))}
      </Select>
    </div>
  )
}

export default GenreFilter
