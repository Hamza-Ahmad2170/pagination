import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginateProps {

    currentPage: number;
    totalPages: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;

   
    visiblePages? : number;
}


export default function Paginate({
    currentPage,
    totalPages,
    setCurrentPage,
    visiblePages = 5        ,
}: PaginateProps) {


       // Calculate the range of pages to display
       let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
       const endPage = Math.min(totalPages, startPage + visiblePages - 1);
   
       // Adjust if we're at the end
       if (endPage - startPage + 1 < visiblePages) {
           startPage = Math.max(1, endPage - visiblePages + 1);
       }
   
       const pages = [];
       for (let i = startPage; i <= endPage; i++) {
           pages.push(i);
       }
   
       const handleNextPage = () => {
           if (currentPage < totalPages) {
               setCurrentPage(prev => prev + 1);
           }
       };


   
       const handlePreviousPage = () => {
           if (currentPage > 1) {
               setCurrentPage(prev => prev - 1);
           }
       };


    return (
        <ul className="flex justify-end gap-1 text-gray-900">
        <li>
            <button
                type="button"
                className={cn(
                    "grid size-8 place-content-center rounded border border-gray-200 transition-colors hover:bg-gray-50 rtl:rotate-180",
                    {
                        "cursor-not-allowed opacity-50": currentPage === 1,
                        "cursor-pointer": currentPage !== 1,
                    }
                )}
                aria-label="Previous page"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
            >
                <ChevronLeft size={16} />
            </button>
        </li>

        {/* Show first page and ellipsis if needed */}
        {startPage > 1 && (
            <>
                <li>
                    <button
                        type="button"
                        className={cn(
                            "block size-8 rounded border border-gray-200 text-center text-sm/8 font-medium transition-colors hover:bg-gray-50 cursor-pointer",
                            {
                                "border-indigo-600 bg-indigo-600 text-white": 1 === currentPage,
                            }
                        )}
                        onClick={() => setCurrentPage(1)}
                    >
                        1
                    </button>
                </li>
                {startPage > 2 && (
                    <li className="flex items-center">
                        <span className="px-2">...</span>
                    </li>
                )}
            </>
        )}

        {/* Visible page range */}
        {pages.map((page) => (
            <li key={page}>
                <button
                    type="button"
                    className={cn(
                        "block size-8 rounded border text-center text-sm/8 font-medium transition-colors cursor-pointer",
                        {
                            "border-indigo-600 bg-indigo-600 text-white": page === currentPage,
                            "border-gray-200 hover:bg-gray-50": page !== currentPage,
                        }
                    )}
                    onClick={() => setCurrentPage(page)}
                >
                    {page}
                </button>
            </li>
        ))}

        {/* Show last page and ellipsis if needed */}
        {endPage < totalPages && (
            <>
                {endPage < totalPages - 1 && (
                    <li className="flex items-center">
                        <span className="px-2">...</span>
                    </li>
                )}
                <li>
                    <button
                        type="button"
                        className={cn(
                            "block size-8 rounded border border-gray-200 text-center text-sm/8 font-medium transition-colors hover:bg-gray-50 cursor-pointer",
                            {
                                "border-indigo-600 bg-indigo-600 text-white": totalPages === currentPage,
                            }
                        )}
                        onClick={() => setCurrentPage(totalPages)}
                    >
                        {totalPages}
                    </button>
                </li>
            </>
        )}

        <li>
            <button
                type="button"
                className={cn(
                    "grid size-8 place-content-center rounded border border-gray-200 transition-colors hover:bg-gray-50 rtl:rotate-180 cursor-pointer",
                    {
                        "cursor-not-allowed opacity-50": currentPage === totalPages,
                        "cursor-pointer": currentPage !== totalPages,
                    }
                )}
                onClick={handleNextPage}
                aria-label="Next page"
                disabled={currentPage === totalPages}
            >
                <ChevronRight size={16} />
            </button>
        </li>
    </ul>
    );
}
