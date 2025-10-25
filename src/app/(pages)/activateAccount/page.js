import ActivateAccountForm from "@/components/forms/activateAccountForm";
import BottomGlitter from "@/components/StyledText/BottomGlitter";

export const metadata = {
  title: "Avtivate Account",
  description:
    "Zero-one Coding Club of Motihari College of Engineering, Motihari",
};

const ActivateAccountPage = () => {
  return (
    <section className="container-70 text-lg">
      <div className="mt-16">
        <BottomGlitter text={`Hi, Activate your account`} />
      </div>
      <ActivateAccountForm />
    </section>
  );
};

export default ActivateAccountPage;
