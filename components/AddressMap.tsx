import { FC } from "react";

const AddressMap: FC = () => {
  return (
    <div className="w-full h-96">
      <iframe
        loading="lazy"
        src="https://yandex.ru/map-widget/v1/?um=constructor%3A67a8e03e829888749f29b03278d21dfe0cca0ed7ef392745c3e577f90af586c1&amp;source=constructor"
        width="100%"
        height="400"
        frameBorder="0"
        className="w-full h-full"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default AddressMap;
