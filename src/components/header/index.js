import LoginBtn from "../button/LoginBtn";
import Logo from "../logo/Logo";
import DesktopNavigation from "./desktop-navigation";
import MobileNavigation from "./mobile-navigation";

const Header = () => {
  return (
    <header
      className={`sticky top-0 left-0 right-0 w-full flex justify-between items-center z-[100] transition-all border border-transparent py-3 px-3 xs:px-6 sm:px-8 xl:px-20  bg-background`}
    >
      <Logo size="default" />
      <div className="flex items-center gap-6">
        {/* Desktop Navlist */}
        <DesktopNavigation />
        {/* Mobile Navlist */}
        <MobileNavigation />
        {/* Login Btn */}
        <LoginBtn />
      </div>
    </header>
  );
};

export default Header;
