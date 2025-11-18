import { useState } from 'react'
import '../styles/customcomponents/RatingStars.css'

interface RatingStarsProps {
    value: number
    interactive?: boolean
    onRatingChange?: (rating: number) => void
    userRating?: number
}

export default function RatingStars({
    value,
    interactive = false,
    onRatingChange,
    userRating
}: RatingStarsProps) {
    const [hoveredRating, setHoveredRating] = useState<number | null>(null)

    // Clampa y muestra 5 estrellas con relleno parcial a 0.5
    const v = Math.max(0, Math.min(5, value))

    // Determina qué calificación mostrar (hover, user rating, o valor promedio)
    const displayRating = hoveredRating !== null ? hoveredRating :
                         (userRating !== undefined ? userRating : v)

    const handleStarClick = (rating: number) => {
        if (interactive && onRatingChange) {
            onRatingChange(rating)
        }
    }

    const handleStarHover = (rating: number) => {
        if (interactive) {
            setHoveredRating(rating)
        }
    }

    const handleMouseLeave = () => {
        if (interactive) {
            setHoveredRating(null)
        }
    }

    return (
        <span
            className={`stars ${interactive ? 'interactive' : ''}`}
            aria-label={`Valoración ${v.toFixed(1)} de 5`}
            onMouseLeave={handleMouseLeave}
        >
            {Array.from({ length: 5 }, (_, index) => {
                const starRating = index + 1
                const isFilled = starRating <= displayRating

                return (
                    <span
                        key={index}
                        className={`star ${isFilled ? 'filled' : 'empty'} ${interactive ? 'clickable' : ''}`}
                        onClick={() => handleStarClick(starRating)}
                        onMouseEnter={() => handleStarHover(starRating)}
                        style={{ cursor: interactive ? 'pointer' : 'default' }}
                    >
                        ★
                    </span>
                )
            })}
        </span>
    )
}
