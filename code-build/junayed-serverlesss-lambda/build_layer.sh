#!/bin/bash

mkdir layers
cd layers
curl -O https://johnvansickle.com/ffmpeg/builds/ffmpeg-git-amd64-static.tar.xz

echo "Unzip Static Build"
tar xf ffmpeg-git-amd64-static.tar.xz

rm ffmpeg-git-amd64-static.tar.xz

echo "Rename Folder to ffmpeg"
mv ffmpeg-git-*-amd64-static ffmpeg