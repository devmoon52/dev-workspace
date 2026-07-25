import {
  CornerUpLeft,
  FileSearchCorner,
  FileUser,
  Search,
  SearchAlert,
  UserSearch,
} from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { calculatedProjects } from "../../redux/selector/projectSelector";
import { calculatedMembers } from "../../redux/selector/memberSelector";
import { getMonthAndDay } from "../../utils/calculateDate";
import { removeShortCut, setShortCut } from "../../redux/slice/modalSlice";
import { Helmet } from "react-helmet-async";

const SearchResult = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { shortCutSuggetion } = useSelector((state) => state.modals);

  const params = new URLSearchParams(search);
  const query = params.get("search-for");

  const { total } = useSelector(calculatedProjects);
  const member = useSelector(calculatedMembers);
  const { total_clients } = useSelector((state) => state.clients);

  const totalSearch = useMemo(() => {
    const projects = total.list.map((d) => {
      return {
        type: "project",
        id: d.projectID,
        title: d.project,
        data: d,
      };
    });

    const members = member.total.list.map((d) => {
      return {
        type: "member",
        id: d.mid,
        title: d.name,
        data: d,
      };
    });

    const clients = total_clients.map((d) => ({
      type: "client",
      id: d.clientID,
      title: d.name,
      data: d,
    }));

    return [...projects, ...members, ...clients];
  }, [total.list, member.total.list, total_clients]);

  const result = useMemo(() => {
    const q = query?.toLowerCase().trim() || "";

    return totalSearch.filter((data) => {
      return (
        data.title.toLowerCase().includes(q) || data.id.toString().includes(q)
      );
    });
  }, [query, totalSearch]);

  useEffect(() => {
    function handler(e) {
      if (e.shiftKey && e.key === "Backspace") {
        e.preventDefault();
        navigate(-1);
      }
    }

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [navigate]);

  useEffect(() => {
    if (!shortCutSuggetion.isSearchPageFirstTime) {
      dispatch(
        setShortCut({
          ...shortCutSuggetion,
          id: "search-page",
          alert: true,
          isSearchPageFirstTime: true,
        }),
      );
    }

    return () => {
      dispatch(removeShortCut());
    };
  }, [dispatch]);

  return (
    <div>
      <Helmet>
        <title>Search Result | Dev Workspace</title>
      </Helmet>

      <header className="md:px-4 px-1.5 md:py-5 py-3">
        <div className="flex md:gap-3 gap-2">
          <button
            onClick={() => {
              navigate(-1);
            }}
            className="md:px-4 px-2 py-1 flex items-center gap-1 rounded-md bg-[#124170] text-white hover:bg-[#164c83] active:bg-[#164c83]"
          >
            <CornerUpLeft aria-hidden="true" size={20} />
            <span className="text-sm">Go Back</span>
          </button>
          <div>
            <h1 className="md:text-xl font-semibold">DEV WORKSPACE</h1>
            <p className="md:text-sm text-xs text-gray-500">
              Distribution Of Works
            </p>
          </div>
        </div>
      </header>

      <main className="md:px-4 px-1.5 my-5 space-y-5">
        <section className="flex items-center gap-1">
          <Search strokeWidth={2.6} aria-hidden="true" />
          <h2 className="text-lg font-semibold">Result for : {query}</h2>
        </section>

        <section>
          <ul className="flex flex-wrap gap-3">
            {result.length === 0 && (
              <div className="text-gray-400 absolute left-1/2 top-1/2 -translate-1/2 flex flex-col justify-center items-center max-w-sm w-full">
                <SearchAlert size={100} strokeWidth={1.6} />
                <div className="-space-y-0.5">
                  <h3 className="text-center mt-2 text-lg">No Data Found !</h3>
                  <p className="text-sm">Please type something valid.</p>
                </div>
              </div>
            )}

            {result.map((r) => {
              const project = r.type === "project";
              const member = r.type === "member";
              const client = r.type === "client";

              return (
                <li
                  key={r.id}
                  className={`bg-white px-3 py-2 shadow-md rounded-md ${r.type === "project" ? "grow-4" : r.type === "client" ? "grow" : "grow-10"} basis-100`}
                >
                  {/* title and id */}
                  <div>
                    <div className="flex items-center gap-1">
                      {project ? (
                        <FileSearchCorner />
                      ) : member ? (
                        <UserSearch />
                      ) : (
                        <FileUser />
                      )}
                      <h3 className="text-lg">{r.title}</h3>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>ID: {r.id}</p>
                      <p>Type: {r.type}</p>
                    </div>
                  </div>

                  {/* ui for projects */}
                  {project && (
                    <>
                      <div className="mt-3 space-y-1 text-gray-600">
                        <p
                          className={`${r.data.status === "completed" ? "bg-emerald-600/20 text-emerald-600" : "bg-amber-600/20 text-amber-600"} px-4 py-1 rounded-full inline-block`}
                        >
                          &#9673;{" "}
                          {r.data.status[0].toUpperCase() +
                            r.data.status.slice(1)}
                        </p>
                        {r.data.deadline && (
                          <p>Deadline: {getMonthAndDay(r.data.deadline)}</p>
                        )}
                        {r.data.status === "completed" && (
                          <p>
                            &#128903;{" "}
                            {r.data.status === "completed" && r.data.isApproved
                              ? `Approved with ${r.data.review}⭐`
                              : "Not approved yet"}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {/* ui for members */}
                  {member && (
                    <div className="mt-3 space-y-2">
                      <p
                        className={`inline-block px-4 py-1 rounded-full ${r.data?.isNew ? "bg-cyan-600/20 text-cyan-600" : r.data?.isActive ? "bg-emerald-600/20 text-emerald-600" : "bg-red-600/20 text-red-600"}`}
                      >
                        &#9679;{" "}
                        {r.data?.isNew
                          ? "New"
                          : r.data?.isActive
                            ? "Active"
                            : "Inactive"}
                      </p>

                      <ul className="">
                        {r.data?.isActive && <h3>Projects</h3>}
                        {r.data.role?.map((p) => (
                          <li
                            className="text-sm text-gray-600"
                            key={p.projectID}
                          >
                            &#9679; {p.project} - {p.projectID}
                          </li>
                        ))}
                      </ul>

                      {r.data.oldProjects && (
                        <p>&#9673; {r.data.oldProjects.length} Old projects</p>
                      )}
                    </div>
                  )}

                  {/* ui for clients */}
                  {client && (
                    <div className="mt-3">
                      <p>Location: {r.data.location}</p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default SearchResult;
