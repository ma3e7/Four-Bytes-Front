import "./paginator.css";

export default function PaginatorComponent({ currentPage, totalPages, onPageChange }) {
    const pages = [...Array(totalPages).keys()];

    return (
        <div className="paginator">
            {pages.map((page) => (
                <button
                    key={page}
                    className={page === currentPage ? "active" : ""}
                    onClick={() => onPageChange(page)}
                >
                    {page + 1}
                </button>
            ))}
        </div>
    );
}
