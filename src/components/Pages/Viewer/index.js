import React, { Suspense, lazy } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import SubMenu from "components/SubMenu";
import Loading from "components/Loading";

const Instructions = lazy(() => import("./Instructions"));
const Species = lazy(() => import("./Species"));
const GenPropViewer = lazy(() => import("./GenPropViewer"));

import { useQuery } from "@apollo/react-hooks";
import { HIERARCHY } from "../../gqlQueries";

const gqlTod3 = (node) => {
  if (node) {
    const children = [];
    const childEdges = node?.gpstepSet?.edges;
    if (childEdges?.length) {
      childEdges.forEach((edge) => {
        const childNode =
          edge.node.gpstepevidencegpSet?.edges[0]?.node.gpAccession;
        if (childNode) {
          children.push({
            id: childNode.accession,
            name: childNode.description,
            children: gqlTod3(childNode),
          });
        }
      });
    }
    return children;
  }
};

const Viewer = () => {
  if (location.pathname === "/viewer") return <Redirect to="/viewer/use" />;

  // useEffect(() => {
  //     $(document).foundation();
  // },[]);

  // const accession = "GenProp0065";
  // const { loading, error, data } = useQuery(HIERARCHY, {
  //     variables: { accession: accession}
  // });
  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error! </p>;

  // const hierarchyJson = {
  //     id: data.genomeProperties.edges[0].node.accession,
  //     name : data.genomeProperties.edges[0].node.description ,
  //     children: gqlTod3(data.genomeProperties.edges[0].node)
  // };
  const links = [
    { to: "/viewer/use", label: "Use" },
    { to: "/viewer/instructions", label: "Instructions" },
    { to: "/viewer/species", label: "Species" },
  ];
  return (
    <>
      <SubMenu links={links} />
      <br />
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route path="/viewer/use" exact={true} component={GenPropViewer} />
          <Route
            path="/viewer/instructions"
            exact={true}
            component={Instructions}
          />
          <Route path="/viewer/species" exact={true} component={Species} />
        </Switch>
      </Suspense>
    </>
  );
};

export default Viewer;
