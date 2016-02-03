/* lexical grammar */
%lex

%%
\s+                   /* skip whitespace */
[a-uw-zA-UW-Z]        return "VAR";
[v]                   return "OROP";
"->"                  return "THENOP";
"^"                   return "ANDOP";
[~\-]                 return "NEG";
"("                   return "LPAREN";
")"                   return "RPAREN";

/lex

%left 'LPAREN' 'RPAREN'
%left 'NEG' 'ANDOP' 'OROP'
%left 'THENOP'

%start stmt

%%

stmt
    : statement
        {
            return $1;
        }
    ;

statement
    : statement 'THENOP' statement
        {
            $$ = {
                "type": "ThenOperation",
                "left": $1,
                "right": $3
            };
        }
    | statement 'OROP' statement
        {
            $$ = {
                "type": "OrOperation",
                "left": $1,
                "right": $3
            };
        }
    | statement 'ANDOP' statement
        {
            $$ = {
                "type": "AndOperation",
                "left": $1,
                "right": $3
            };
        }
    | 'NEG' statement
        {
            $$ = {
                "type": "NegationOperation",
                "val": $2
            };
        }
    | 'LPAREN' statement 'RPAREN'
        {
            $$ = {
                "type": "Closure",
                "val": $2
            };
        }
    | 'VAR'
        {
            $$ = {
                "type": "Variable",
                "val": $1
            };
        }
    ;