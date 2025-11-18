/*
Sample media data for development and testing purposes.
Delete in production. then it will come from an API.
*/

import type { MediaItem } from '../components/MediaSection'

const now = new Date()

function daysAgo(n: number) {
    const d = new Date(now)
    d.setDate(d.getDate() - n)
    return d.toISOString()
}

export const videos: MediaItem[] = [
    { id: 'v1', title: 'Descubriendo ESIMedia', addedAt: daysAgo(1), rating: 4.5, thumbnail: 'https://picsum.photos/seed/video1/640/360' },
    { id: 'v2', title: 'Top 10 Sci-Fi', addedAt: daysAgo(2), rating: 3.5, thumbnail: 'https://picsum.photos/seed/video2/640/360' },
    { id: 'v3', title: 'Cómo grabar mejor audio', addedAt: daysAgo(3), rating: 4.0, thumbnail: 'https://picsum.photos/seed/video3/640/360' },
    { id: 'v4', title: 'Behind the Scenes', addedAt: daysAgo(4), rating: 5.0, thumbnail: 'https://picsum.photos/seed/video4/640/360' },
    { id: 'v5', title: 'Documental breve', addedAt: daysAgo(5), rating: 2.5, thumbnail: 'https://picsum.photos/seed/video5/640/360' },
]

export const audios: MediaItem[] = [
    { id: 'a1', title: 'Podcast: estreno', addedAt: daysAgo(1), rating: 4.0, thumbnail: 'https://picsum.photos/seed/audio1/640/360' },
    { id: 'a2', title: 'Lo-fi Focus Mix', addedAt: daysAgo(2), rating: 3.0, thumbnail: 'https://picsum.photos/seed/audio2/640/360' },
    { id: 'a3', title: 'Entrevista exclusiva', addedAt: daysAgo(3), rating: 4.5, thumbnail: 'https://picsum.photos/seed/audio3/640/360' },
    { id: 'a4', title: 'Ambient Pack', addedAt: daysAgo(4), rating: 5.0, thumbnail: 'https://picsum.photos/seed/audio4/640/360' },
    { id: 'a5', title: 'Noticias semanales', addedAt: daysAgo(5), rating: 2.0, thumbnail: 'https://picsum.photos/seed/audio5/640/360' },
]
