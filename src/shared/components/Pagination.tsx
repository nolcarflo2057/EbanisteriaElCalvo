"use client";
import generatePaginationNumbers from "@/shared/utils/generatePaginationNumbers";
import clsx from "clsx";
import Link from "next/link";
import { redirect, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface Props {
	totalPages: number;
}
export const Pagination = ({ totalPages }: Props) => {
	const pathname = usePathname(); // me da la url actual
	const searchParams = useSearchParams();
	const pageString = searchParams.get("page") ?? 1;
	const  currentPage = isNaN(+pageString ) ? 1 : +pageString 
	// let  currentPage = isNaN(+pageString ) ? 1 : +pageString 
	if(currentPage < 1 || isNaN(currentPage)){
		// currentPage = 1
		redirect(pathname as any)
	}

	const allPage = generatePaginationNumbers(currentPage, totalPages);

	const createPageUrl = (pageNumber: number | string) => {
		const params = new URLSearchParams(searchParams.toString());
		if (pageNumber === "...") {
			return `${pathname}?${params.toString()}`;
		}
		if (+pageNumber <= 0) {
			return `${pathname}?${params.toString()}`; // href= '/'
		}
		if (+pageNumber > totalPages) {
			return `${pathname}?${params.toString()}`; // Next >
		}

		params.set("page", pageNumber.toString());
		return `${pathname}?${params.toString()}`;
	};

	return (
		<div className="flex text-center justify-center mt-10 mb-8">
			<nav aria-label="Page navigation example">
				<ul className="flex list-style-none">
					<li className="page-item ">
						<Link
							// className="page-link relative block py-1.5 px-3  border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-500 pointer-events-none focus:shadow-none hover:text-gray-500 hover:bg-gray-200"
							className={clsx(
								"page-link relative block py-1.5 px-3  border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none",
								{
									"hidden": currentPage === 1,
								},
							)

							}
							href={createPageUrl(currentPage - 1) as any}
						>
							<ChevronLeftIcon className="h-5 w-5" />
						</Link>
					</li>
					{allPage.map((page, index) => (
						<li key={page + "" + index} className="page-item">
							<Link
								className={clsx(
									"page-link relative block py-1.5 px-3 border-0  outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none",
									{
										"bg-primary text-primary-foreground shadow-md hover:opacity-90":
											page === currentPage,
									},
								)}
								href={createPageUrl(page) as any}
							>
								{page}
							</Link>
						</li>
					))}

					<li className="page-item">
						<Link
							className={clsx(
								"page-link relative block py-1.5 px-3  border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none",
								{
									"hidden": currentPage === totalPages,
								},
							)

							}
							href={createPageUrl(currentPage + 1) as any}
						>
							<ChevronRightIcon className="h-5 w-5" />
						</Link>
					</li>
				</ul>
			</nav>
		</div>
	);
};


