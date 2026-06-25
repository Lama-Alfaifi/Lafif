type SectionTitleProps = {
  title: string;
};

export default function SectionTitle({
  title,
}: SectionTitleProps) {

  return (

    <h1
      className="
        text-3xl
        font-black
        text-[#0F172A]
      "
    >
      {title}
    </h1>

  );

}