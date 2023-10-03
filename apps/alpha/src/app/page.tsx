import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import {useViewport} from "@alpha/app/context/viewport-context";

export interface PageProps {
  children?: any;
  id?: string;
}

function Page(props: PageProps) {

 const [windowWidth] = useViewport()
  return (
    <div
      className="resource animate__animated animate__fadeIn"
      style={{
        zoom: `${windowWidth / 1920}`,
      }}
      id={props.id}
    >
      {props.children}
    </div>
  );
}

export default Page;
