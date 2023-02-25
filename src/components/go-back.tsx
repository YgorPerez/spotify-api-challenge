import { useRouter } from "next/router";

const GoToPreviousPage: React.FC = () => {
	const router = useRouter();
	return (
		<button
			onClick={() => router.back()}
			className="ml-8 flex items-center text-gray-50"
		>
			<FontAwesomeIcon icon="fa-light fa-angle-left" />
			<span className="ml-2">Voltar</span>
		</button>
	);
};

export default GoToPreviousPage;
