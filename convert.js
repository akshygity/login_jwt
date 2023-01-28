const edge = require('edge');
const path = require('path');

const spdx2cyclonedx = edge.func(`
    using System;
    using System.IO;
    using CycloneDX.Spdx.Interop;

    async (input) => {
        var spdxFile = (string)input.spdxFile;
        var cyclonedxFile = (string)input.cyclonedxFile;

        var spdx = SpdxDocument.FromFile(spdxFile);
        var cyclonedx = spdx.ToCycloneDX();
        File.WriteAllText(cyclonedxFile, cyclonedx);
        return cyclonedx;
    }
`);

const input = {
  spdxFile: path.join(__dirname, 'sbom_file.json'),
  cyclonedxFile: path.join(__dirname, '_manifest/manifest.CycloneDX.json')
};

spdx2cyclonedx(input, (error, result) => {
  if (error) throw error;
  console.log(result);
});
