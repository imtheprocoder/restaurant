import React, { useMemo } from 'react'
import classes from './tags.module.css'
import { Link } from 'react-router-dom'

export default function Tags({tags, forFoodPage}) {
  // Sort tags consistently and memoize the result
  const sortedTags = useMemo(() => {
    if (!tags) return [];
    
    // Keep 'Alla' at the beginning
    return [...tags].sort((a, b) => {
      if (a.name === 'Alla') return -1;
      if (b.name === 'Alla') return 1;
      // Sort by count (descending) and then alphabetically for stable ordering
      if (a.count !== b.count) {
        return b.count - a.count;
      }
      return a.name.localeCompare(b.name);
    });
  }, [tags]);

  return (
    <div className={classes.container} style={{
      justifyContent: forFoodPage? 'start': 'center',
    }}>
      {sortedTags.map(tag => (
        <Link key={tag.name} to={`/tag/${tag.name}`}>
          {tag.name}
          {!forFoodPage && `(${tag.count})`}
        </Link>
      ))}
    </div>
  )
}