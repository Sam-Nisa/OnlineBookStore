import GenresPage from "./component/GenresPage";
import Navbar from "./component/Navbar";
import BooksPage from "./component/BooksPage";

export default function Home() {
  return (
    <>
      <Navbar />
      <GenresPage />
      <BooksPage />
    </>
  );
}
