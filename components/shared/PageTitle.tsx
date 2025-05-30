const PageTitle = ({ title }: { title: string }) => {
  return (
    <div className="text-center mb-5">
      <p className="text-base md:text-xl font-bold">{title}</p>
    </div>
  );
};

export default PageTitle;
