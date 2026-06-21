import ArchiveCard from "./ArchiveCard.jsx";

export default function ArchiveGrid({ books }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <ArchiveCard key={book.id} book={book} />
      ))}
    </div>
  );
}
