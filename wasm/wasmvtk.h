#ifndef WASMVTK_H_
#define WASMVTK_H_

#include <vtkCellArray.h>
#include <vtkCellData.h>
#include <vtkDoubleArray.h>
#include <vtkLine.h>
#include <vtkPointData.h>
#include <vtkPoints.h>
#include <vtkPolyData.h>
#include <vtkQuad.h>
#include <vtkSmartPointer.h>
#include <vtkTriangle.h>
#include <vtkXMLPolyDataReader.h>
#include <vtkXMLPolyDataWriter.h>
#include "LSlib/output.hpp"

namespace wasm {

template <int D>
void writeVTP(const lvlset::OutputSurface<D> &surface, const std::string &filename) {

  auto VTKpolygons = vtkSmartPointer<vtkCellArray>::New();
  auto VTKpolydata = vtkSmartPointer<vtkPolyData>::New();
  auto VTKpoints = vtkSmartPointer<vtkPoints>::New();
  // VTKpoints->SetDataTypeToDouble();

  std::cout << "VTP D=" << D << std::endl;
  // points
  for (unsigned int i = 0; i < surface.Nodes.size(); i++) {
    const double x = surface.Nodes[i][0];
    const double y = surface.Nodes[i][1];
    const double z = D == 3 ? surface.Nodes[i][2] : 0.0;
    double xyz[3] = {x, y, z};
    VTKpoints->InsertNextPoint(xyz);
  }
  std::cout << "VTP num points=" << surface.Nodes.size() << std::endl;

  if (D == 3) { // cells == triangles
    for (unsigned int i = 0; i < surface.Elements.size(); i++) {
      auto tmptriangle = vtkSmartPointer<vtkTriangle>::New();
      tmptriangle->GetPointIds()->SetId(0, surface.Elements[i][0]);
      tmptriangle->GetPointIds()->SetId(1, surface.Elements[i][1]);
      tmptriangle->GetPointIds()->SetId(2, surface.Elements[i][2]);
      VTKpolygons->InsertNextCell(tmptriangle);
    }
    std::cout << "VTP num triangles=" << surface.Elements.size() << std::endl;

  } else if (D == 2) { // cells == lines
    for (unsigned int i = 0; i < surface.Elements.size(); i++) {
      auto tmpline = vtkSmartPointer<vtkLine>::New();
      tmpline->GetPointIds()->SetId(0, surface.Elements[i][0]);
      tmpline->GetPointIds()->SetId(1, surface.Elements[i][1]);
      VTKpolygons->InsertNextCell(tmpline);
    }
    std::cout << "VTP num lines=" << surface.Elements.size() << std::endl;
  }

  VTKpolydata->SetPoints(VTKpoints);
  if (D == 3) {
    std::cout << "VTP SetPolys" << std::endl;
    VTKpolydata->SetPolys(VTKpolygons);
  } else if (D == 2) {
    std::cout << "VTP SetLines" << std::endl;
    VTKpolydata->SetLines(VTKpolygons);
  }

  auto writer = vtkSmartPointer<vtkXMLPolyDataWriter>::New();
  writer->SetFileName(filename.c_str());
  writer->SetInputData(VTKpolydata);
  writer->SetDataModeToAscii();
  //   writer->SetDataModeToBinary();

  writer->Write();
}
} // namespace wasm

#endif /*WASMVTK_H_*/