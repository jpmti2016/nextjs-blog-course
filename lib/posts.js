import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";

const postDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData() {
  //get file names under /posts
  const fileNames = fs.readdirSync(postDirectory);
  const allPostsData = fileNames.map((filename) => {
    //remove .md to get id
    const id = filename.replace(/\.md$/, "");

    //read markdown file as string
    const fullPath = path.join(postDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    //parse   post metadata section
    const matterResult = matter(fileContents);
    //combine data with the id
    return {
      id,
      ...matterResult.data,
    };
  });
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postDirectory);

  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getPostData(id) {
  const fullPath = path.join(postDirectory, `${id}.md`);
  const fileContens = fs.readFileSync(fullPath, "utf8");
  //parse post metadata section
  const matterResult = matter(fileContens);

  //convert markdown into html string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  //combine data with id and contentHtml
  return { id, contentHtml, ...matterResult.data };
}
