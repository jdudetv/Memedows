import clsx from "clsx";
import { useFirestore, useFirestoreDocData } from "reactfire";

const SbitItem = ({ data }) => {
  return (
    <div
      className={clsx(
        "w-1/10 h-1/10 text-2xl font-bold text-center py-1 items-center align-middle border-2 border-black",
        data.state ? "text-red-500 pt-0 font-black text-3xl" : "text-black"
      )}
    >
      {!data.state ? data.number : "X"}
    </div>
  );
};

const Sbit = () => {
  const docRef = useFirestore().collection("public").doc("SecretBit");
  const data: any = useFirestoreDocData(docRef).data;

  return (
    <div className="flex flex-row flex-wrap">
      {data.bits.map((item) => (
        <SbitItem key={item.number} data={item} />
      ))}
    </div>
  );
};

export default Sbit;
