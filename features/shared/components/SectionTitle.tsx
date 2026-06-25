type SectionTitleProps = {

  title: string;

  subtitle?: string;

};

export default function SectionTitle({
  title,
  subtitle,
}: SectionTitleProps) {

  return (

    <div>

      <h1
        className="
          text-3xl
          md:text-4xl
          font-black
          text-[#0F172A]
        "
      >
        {title}
      </h1>

      {subtitle && (

        <p
          className="
            mt-3
            text-gray-500
            leading-7
          "
        >
          {subtitle}
        </p>

      )}

    </div>

  );

}