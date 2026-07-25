import { File, FileXCorner, Star, Trophy } from "lucide-react";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { filter } from "../utils/short";
import { calculatedProjects } from "../redux/selector/projectSelector";

const TopProjects = () => {
  const { approved } = useSelector(calculatedProjects);

  const megaPerformed = useMemo(() => {
    return approved.list
      .sort((a, b) => {
        if (a.review !== b.review) return b.review - a.review;
        else {
          b.projectID - a.projectID;
        }
      })
      .slice(0, 6);
  }, [approved]);

  return (
    <div className="space-y-4 p-4 sm:min-w-auto min-w-80">
      <div className="flex items-center gap-1">
        <Trophy
          aria-hidden="true"
          size={26}
          strokeWidth={2.6}
          color="#364153"
        />
        <h2 className="font-semibold text-lg text-gray-700">
          Top Performing Projects
        </h2>
      </div>

      <ul>
        {megaPerformed.length === 0 && (
          <div className="my-20 flex justify-center">
            <div className="flex gap-1 border px-10 py-7 rounded-full border-gray-300 text-gray-500">
              <FileXCorner /> <span>No Project Available !</span>
            </div>
          </div>
        )}
        {megaPerformed.map((mp, i) => (
          <li
            key={mp.projectID}
            role="listitem"
            className={`flex justify-between py-3 ${megaPerformed.length - 1 !== i ? "border-b" : "border-none"} border-gray-400`}
          >
            <div className="flex items-center gap-1">
              <File size={22} aria-hidden="true" />
              <p className="sm:text-[16px] text-sm">{mp.project}</p>
            </div>
            <div className="flex items-center gap-1">
              <span>{mp.review}</span>
              <Star
                aria-hidden="true"
                size={20}
                color="#E17100"
                fill="#E17100"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopProjects;
