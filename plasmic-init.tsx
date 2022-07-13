import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";
import { DataProvider } from "@plasmicapp/host";
import React from "react";

export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: "pwZHvTRtjvzckayL6gR7va",
      token: "gdZVE2AjKRkZUN4E3yyI1KSxdI2H981v1OMWXCOxFV5fo2v2wOsPgV6R8cuBCeDbtX8WFnoi50gfuEvAcQ",
    },
  ],
  preview: true,
});


import "antd/dist/antd.css";
import { Table as AntdTable } from "antd";
import useSWR from "swr";

const MoviesFetcher = (props: any) => {
  const { data } = useSWR("actors", async () => {
    return await (
      await fetch("https://api.themoviedb.org/3/movie/popular?api_key=9beb1634cec80c0b62602a3d1ee9bdf9&language=en-US&page=1")
    ).json();
  });
  return <DataProvider name={"movies"} data={data}>
    {props.children}
  </DataProvider>
}

PLASMIC.registerComponent(MoviesFetcher, {
  name: "Movies Fetcher",
  displayName: "Movies Fetcher",
  providesData: true,
  props: {
    children: "slot"
  },
});

const Table = (props: {
  className: string,
  rows: Record<string, any>[],
  filter: any,
  columns: {
    title: string;
    dataIndex: string;
  }[],
  onSelectRow: (record: Record<string, any>) => void;
}) => {
  const { className, rows, filter, columns, onSelectRow } = props;
  return <AntdTable
    className={className}
    dataSource={(rows ?? []).slice(0, 10).filter(row => (row[columns[0].dataIndex] as string)?.toLowerCase().startsWith((filter ?? "").toLowerCase()))}
    columns={columns}
    pagination={false}
    bordered={true}
    onRow={(record, rowIndex) => ({
      onClick: (e) => onSelectRow(record)
    })}
  />
};

PLASMIC.registerComponent(Table, {
  name: "Table",
  props: {
    rows: "object",
    columns: "object",
    filter: "string",
    onSelectRow: "object",
  },
  unstable__states: {
    selectedRow: {
      type: "readonly",
      onChangeProp: "onSelectRow",
      initVal: undefined,
    }
  }
})

const MovieInfo = (props: any) => {
  const { data } = useSWR(`movie/${props.id ?? 550}`, async () => {
    return await (
      await fetch(`https://api.themoviedb.org/3/movie/${props.id ?? 550}?api_key=9beb1634cec80c0b62602a3d1ee9bdf9&language=en-US&append_to_response=credits,images`)
    ).json();
  });
  return <DataProvider name={"movie"} data={data}>
    {props.children}
  </DataProvider>
}

PLASMIC.registerComponent(MovieInfo, {
  name: "Movie Info",
  displayName: "Movie Info",
  providesData: true,
  props: {
    children: "slot",
    id: "number"
  },
});
