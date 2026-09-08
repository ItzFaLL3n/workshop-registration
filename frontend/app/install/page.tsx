import type { Metadata } from "next";
import { Component } from "@/components/ui/dev-tool-landing-page";

export const metadata: Metadata = {
  title: "Setup Guide — LLM Agents Workshop",
  description:
    "Step-by-step setup for the LLM Agents workshop: install Python 3.10+, create a virtual environment, download the 14-demo pack, and install dependencies before Day 1.",
};

export default function InstallPage() {
  return <Component currentPath="/install" />;
}
