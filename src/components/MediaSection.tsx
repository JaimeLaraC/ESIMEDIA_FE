import MediaCard from './MediaCard'

export interface MediaItem {
    id: string
    title: string
    addedAt: string // ISO date
    rating: number  // 0..5
    thumbnail: string
}

export default function MediaSection({
    title,
    items,
    kind
}: {
    title: string
    items: MediaItem[]
    kind: 'video' | 'audio'
}) {
    return (
        <section className="section" aria-label={title}>
            <h2>{title}</h2>
            <div className="grid">
                {items.map(item => (
                    <MediaCard key={item.id} item={item} kind={kind} creator={''} rating={0} ratingCount={0} />
                ))}
            </div>
        </section>
    )
}
