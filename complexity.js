const parser = require('@babel/parser');
const traverse = require('@babel/traverse');
function calculateCyclomaticComplexity(code) {
  const ast = parser.parse(code);
  let complexity = 1; // 默认圈复杂度为1，表示函数的起始节点
  traverse.default(ast, {
    IfStatement() {
      complexity++;
    },
    WhileStatement() {
      complexity++;
    },
    ForStatement() {
      complexity++;
    },
    SwitchStatement() {
      complexity++;
    },
    LogicalExpression() { // || 
      complexity++;
    },
    ConditionalExpression() { // boolean ? 'a' : 'b'
      complexity++;
    },
  });

  return complexity;
}
// 示例代码
const code = `
function foo(x) {
  if (x > 0) {
    console.log("Positive");
  } else {
    console.log("Non-positive");
  }
}
`;
const complexity = calculateCyclomaticComplexity(code);
console.log("代码的圈复杂度为:", complexity);