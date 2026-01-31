import { getFacultyById, getSortedFaculty } from "../../models/faculty/faculty.js";

export const facultyListPage = (req, res) => {
  // query param: /faculty?sort=name|department|title
  const sortBy = req.query.sort; // can be undefined
  const faculty = getSortedFaculty(sortBy);

  res.render("faculty/list", {
    title: "Faculty Directory",
    faculty,
    sortBy: sortBy || "name"
  });
};

export const facultyDetailPage = (req, res) => {
  // route param: /faculty/:facultyId 
  const facultyId = req.params.facultyId;
  const facultyMember = getFacultyById(facultyId);

  if (!facultyMember) {
    // 404 Statu match with /errors/404.ejs
    return res.status(404).render("errors/404.ejs", {
      title: "Not Found"
    });
  }

  res.render("faculty/detail", {
    title: facultyMember.name,
    faculty: facultyMember
  });
};
