import { Link } from "react-router";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="text-2xl font-bold" style={{ color: '#de9f7c' }}>
          Called to Work
        </span>
      </Link>
      <div className="flex items-center gap-3">
        <Link
          to="/upload"
          className="navbar-button"
        >
          <span className="text-sm font-medium">Upload Resume</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
