
export default function ShimmerEffectMovie() {
  return (
    <div className=" flex w-fit mx-auto">
      <ul className="flex flex-wrap gap-4 justify-center items-center">
        
        {[...Array(10)].map((_,id) => {
         return <li key={id} className="flex gap-2 hover:scale-105 cursor-pointer animate-pulse">
            <img className="bg-slate-300 w-70 h-80" src={null} alt="" />
          </li>;
        })}
      </ul>
    </div>
  );
}
