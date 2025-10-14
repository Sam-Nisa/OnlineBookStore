import GenresPage from "./component/GenresPage";
import Navbar from "./component/Navbar";
import BooksPage from "./component/BooksPage";
import Footer from "./component/Footer";


export default function Home() {
  return (
    <>
      <Navbar />
      <GenresPage />
      <BooksPage />
      <Footer />
    </>
  );
}
