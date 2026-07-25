import React, { useEffect, useMemo, useRef, useState } from "react";
import ProjectMonitorData from "./ProjectMonitorData";
import { FileChartPie } from "lucide-react";
import { useSelector } from "react-redux";
import { calculatedProjects } from "../redux/selector/projectSelector";
import { motion } from "motion/react";
import CountDown from "./CountDown";

const ProjectMonitor = () => {
  const { total } = useSelector(calculatedProjects);
  const { system } = useSelector((state) => state.settings);
  const { enabled, loop, loopDuration } = system.projectMonitor;

  const startTime = useRef(Date.now());
  const duration = loopDuration * 1000;
  const remainingTime = useRef(duration);
  const timerRef = useRef(null);
  const [animationKey, setAnimationKey] = useState(0);

  const [index, setIndex] = useState({
    projectIndex: 0,
    cidIndex: 0,
  });

  // raset start-time and remaining time
  function rasetAll() {
    startTime.current = Date.now();
    remainingTime.current = duration;
  }

  // projectClientMap - clientID: [projects arr]
  const projectClientMap = useMemo(() => {
    let cidProjectMap = {};

    for (const p of total.list) {
      if (!cidProjectMap[p.clientID]) {
        cidProjectMap[p.clientID] = [];
      }

      cidProjectMap[p.clientID].push(p);
    }

    const arrOfClientID = Array.from(Object.keys(cidProjectMap)).map(Number);

    return {
      cidProjectMap,
      arrOfClientID,
    };
  }, [total]);

  // destructure projectClientMap = clientID project map + array of client id
  let { cidProjectMap, arrOfClientID } = projectClientMap;

  // set maximum index for cidIndex
  const safeClientIndex = Math.min(
    index.cidIndex,
    Math.max(arrOfClientID.length - 1, 0),
  );

  let currentCID = arrOfClientID[safeClientIndex];

  const projects = cidProjectMap[currentCID] || [];

  // set maximum index for projectIndex
  const safeProjectIndex = Math.min(
    index.projectIndex,
    Math.max(projects.length - 1, 0),
  );

  const currentProject = projects[safeProjectIndex];

  // update index when delete projects
  useEffect(() => {
    setIndex((prev) => {
      const safeCidIndex = Math.min(
        prev.cidIndex,
        Math.max(arrOfClientID.length - 1, 0),
      );

      const currentCID = arrOfClientID[safeCidIndex];
      const projects = cidProjectMap[currentCID] || [];

      const safeProjectIndex = Math.min(
        prev.projectIndex,
        Math.max(projects.length - 1, 0),
      );

      if (
        safeCidIndex === prev.cidIndex &&
        safeProjectIndex === prev.projectIndex
      ) {
        return prev;
      }

      return {
        cidIndex: safeCidIndex,
        projectIndex: safeProjectIndex,
      };
    });
  }, [arrOfClientID, cidProjectMap]);

  // set and clear a new timer for each project
  useEffect(() => {
    if (loop) {
      timerRef.current = setTimeout(nextProject, remainingTime.current);
    }

    return () => clearTimeout(timerRef.current);
  }, [currentProject]);

  // pause timer
  function pause() {
    // clear timeout
    clearTimeout(timerRef.current);

    const ellapse = Date.now() - startTime.current;
    remainingTime.current = remainingTime.current - ellapse;
  }

  // play timer
  function play() {
    clearTimeout(timerRef.current);
    startTime.current = Date.now();

    timerRef.current = setTimeout(() => {
      nextProject();
    }, remainingTime.current);
  }

  // Next Project
  function nextProject() {
    rasetAll();
    setAnimationKey((prev) => prev + 1); // sync with progress animation
    if (index.projectIndex + 1 !== cidProjectMap[currentCID].length) {
      // option A : increase project index
      setIndex((prev) => {
        return {
          ...prev,
          projectIndex: prev.projectIndex + 1,
        };
      });
    } else {
      if (index.cidIndex + 1 !== arrOfClientID.length) {
        // option B : increase client index
        setIndex((prev) => {
          return {
            projectIndex: 0,
            cidIndex: prev.cidIndex + 1,
          };
        });
      } else {
        // option C : raset everything to 0, 0
        setIndex((prev) => {
          return {
            projectIndex: 0,
            cidIndex: 0,
          };
        });
      }
    }
  }

  // Prev Project
  function prevProject() {
    rasetAll();
    setAnimationKey((prev) => prev + 1);

    setIndex((prev) => {
      // Case 1: same client, previous project
      if (prev.projectIndex > 0) {
        return {
          ...prev,
          projectIndex: prev.projectIndex - 1,
        };
      }

      // Case 2: previous client, last project
      if (prev.cidIndex > 0) {
        const prevCID = arrOfClientID[prev.cidIndex - 1];

        return {
          cidIndex: prev.cidIndex - 1,
          projectIndex: cidProjectMap[prevCID].length - 1,
        };
      }

      // Case 3: first client + first project
      // jump to very last project
      const lastCID = arrOfClientID[arrOfClientID.length - 1];

      return {
        cidIndex: arrOfClientID.length - 1,
        projectIndex: cidProjectMap[lastCID].length - 1,
      };
    });
  }

  if (total.count === 0 || !enabled) {
    return null;
  }

  return (
    <section className="space-y-3 @container">
      {/* head */}
      <div className="flex items-center gap-2">
        <FileChartPie aria-hidden="true" strokeWidth={2.4} />
        <h2 className="text-lg font-semibold uppercase">Project Monitor</h2>
      </div>

      <div className="flex gap-3 @4xl:flex-row flex-col">
        <div className="@4xl:w-[65%] w-full">
          {/* Project to client data */}
          <ProjectMonitorData
            currentDisplay={cidProjectMap}
            currentProject={currentProject}
            currentCID={currentCID}
            onPause={pause}
            onPlay={play}
            setCustomIndex={(index) => {
              rasetAll();
              setAnimationKey((prev) => prev + 1);
              setIndex((prev) => ({ ...prev, projectIndex: index }));
            }}
            raset={() => setAnimationKey((prev) => prev + 1)}
            onNext={nextProject}
            onBack={prevProject}
            animationKey={animationKey}
          />
        </div>

        {/* deadline countdown */}
        <CountDown currentProject={currentProject} />
      </div>
    </section>
  );
};

export default ProjectMonitor;
