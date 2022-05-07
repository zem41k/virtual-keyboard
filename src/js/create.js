export default function create(el, classNames, children, parent, ...dataAttr) {
  const element = document.createElement(el);
  if (classNames) element.classList.add(...classNames.split(' '));
  if (parent) parent.appendChild(element);
  if (children && Array.isArray(children)) {
    children.forEach((childElement) => childElement && element.appendChild(childElement));
  } else if (children && typeof children === 'object') {
    element.appendChild(children);
  } else if (children && typeof children === 'string') {
    element.innerHTML = children;
  }
  if (dataAttr.length) {
    dataAttr.forEach(([attName, attValue]) => {
      if (attName.match(/value|id|placeholder|cols|rows/)) {
        element.setAttribute(attName, attValue);
      } else {
        element.dataset[attName] = attValue;
      }
    });
  }
  return element;
}
