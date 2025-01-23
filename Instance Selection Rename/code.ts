figma.showUI(__html__);

// Function to handle selection changes
function updateSelectedText() {
  const selected = figma.currentPage.selection[0];
  if (selected && selected.type === "INSTANCE") {
    const textNode = selected.findChild(
      (child) => child.type === "TEXT"
    ) as TextNode | null;
    if (textNode && textNode.characters) {
      figma.ui.postMessage({ type: "update-selected", text: selected.name });
      figma.ui.postMessage({
        type: "update-current",
        text: textNode.characters,
      });
    } else {
      figma.ui.postMessage({ type: "update-current", text: "No text found" });
    }
  } else {
    figma.ui.postMessage({
      type: "update-selected",
      text: "No valid selection",
    });
    figma.ui.postMessage({ type: "update-current", text: "none" });
  }
}

figma.on("selectionchange", updateSelectedText);

figma.ui.onmessage = (msg) => {
  if (msg.type === "rename") {
    // Get the selected node
    const selected = figma.currentPage.selection[0];
    if (!selected) {
      figma.notify("Please select a component!");
      return;
    }

    if (selected.type === "INSTANCE") {
      const textNode = selected.findOne(
        (child) => child.type === "TEXT"
      ) as TextNode;
      if (textNode && textNode.characters) {
        textNode.name = textNode.characters;
        figma.notify(`Renamed to "${textNode.characters}"`);
      } else {
        figma.notify("No text found in the selected component.");
      }
    } else {
      figma.notify("Selected item is not an instance, frame, or group.");
    }
  }

  // Close the plugin
  if (msg.type === "close") {
    figma.closePlugin();
  }
};

updateSelectedText();
