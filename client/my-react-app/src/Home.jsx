import { Link } from "react-router-dom";
export default function Home() {
  return (
    <>
      <h1>Hello Nigga</h1>
      <Link to="/test">
        <button>Click me</button>
      </Link>
    </>
  );
}
