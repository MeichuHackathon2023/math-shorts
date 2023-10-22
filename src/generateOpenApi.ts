import { OpenApiGeneratorV3 } from "zod-to-openapi";
import fs from "fs";
import YAML from "yamljs";
// Import files which contain schema or routes we want to generate for open api docs
import "@/routers/index";

import { registry } from "@/utils/openApi";

function generateOpenApiDocs() {
    const generator = new OpenApiGeneratorV3(registry.definitions);
    const docs = generator.generateDocument({
        info: {
            version: "1.0.0",
            title: "查理與他的快樂夥伴 - 數學解題短影片",
            description: "API docs",
        },
        servers: [],
        openapi: "3.0.0"
    });

    const fileContent = YAML.stringify(docs);
    fs.writeFileSync(`openapi-docs.yml`, fileContent, {
        encoding: "utf-8",
    });
}

generateOpenApiDocs();
