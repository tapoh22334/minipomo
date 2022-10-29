#!/bin/bash
(cd src-tauri;  cargo.exe about generate -o ../src/modules/resource/THIRD-PARTY-NOTICES-cargo.txt about.hbs)
