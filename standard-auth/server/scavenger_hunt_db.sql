--
-- PostgreSQL database dump
--

-- Dumped from database version 14.9 (Homebrew)
-- Dumped by pg_dump version 14.9 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: game; Type: TABLE; Schema: public; Owner: hemalathaningappakondakundi
--

CREATE TABLE public.game (
    gid integer NOT NULL,
    name character varying(30) NOT NULL,
    email character varying(30) NOT NULL,
    code character varying(30) NOT NULL,
    link character varying(30),
    questions jsonb
);


ALTER TABLE public.game OWNER TO hemalathaningappakondakundi;

--
-- Name: game_gid_seq; Type: SEQUENCE; Schema: public; Owner: hemalathaningappakondakundi
--

CREATE SEQUENCE public.game_gid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.game_gid_seq OWNER TO hemalathaningappakondakundi;

--
-- Name: game_gid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hemalathaningappakondakundi
--

ALTER SEQUENCE public.game_gid_seq OWNED BY public.game.gid;


--
-- Name: user_progress; Type: TABLE; Schema: public; Owner: hemalathaningappakondakundi
--

CREATE TABLE public.user_progress (
    gid integer,
    email character varying(30) NOT NULL,
    progress jsonb,
    points character varying(30),
    latest_time_date character varying(30) DEFAULT 'N/A'::character varying
);


ALTER TABLE public.user_progress OWNER TO hemalathaningappakondakundi;

--
-- Name: users; Type: TABLE; Schema: public; Owner: hemalathaningappakondakundi
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(30),
    email character varying(30) NOT NULL,
    isplayinggame character varying(30) DEFAULT 'N/A'::character varying
);


ALTER TABLE public.users OWNER TO hemalathaningappakondakundi;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: hemalathaningappakondakundi
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO hemalathaningappakondakundi;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: hemalathaningappakondakundi
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: game gid; Type: DEFAULT; Schema: public; Owner: hemalathaningappakondakundi
--

ALTER TABLE ONLY public.game ALTER COLUMN gid SET DEFAULT nextval('public.game_gid_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: hemalathaningappakondakundi
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: game; Type: TABLE DATA; Schema: public; Owner: hemalathaningappakondakundi
--

COPY public.game (gid, name, email, code, link, questions) FROM stdin;
\.


--
-- Data for Name: user_progress; Type: TABLE DATA; Schema: public; Owner: hemalathaningappakondakundi
--

COPY public.user_progress (gid, email, progress, points, latest_time_date) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: hemalathaningappakondakundi
--

COPY public.users (id, name, email, isplayinggame) FROM stdin;
\.


--
-- Name: game_gid_seq; Type: SEQUENCE SET; Schema: public; Owner: hemalathaningappakondakundi
--

SELECT pg_catalog.setval('public.game_gid_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: hemalathaningappakondakundi
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: game game_pkey; Type: CONSTRAINT; Schema: public; Owner: hemalathaningappakondakundi
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT game_pkey PRIMARY KEY (gid);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: hemalathaningappakondakundi
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (email);


--
-- Name: user_progress fk_game; Type: FK CONSTRAINT; Schema: public; Owner: hemalathaningappakondakundi
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT fk_game FOREIGN KEY (gid) REFERENCES public.game(gid);


--
-- Name: game fk_users; Type: FK CONSTRAINT; Schema: public; Owner: hemalathaningappakondakundi
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT fk_users FOREIGN KEY (email) REFERENCES public.users(email);


--
-- Name: user_progress fk_users; Type: FK CONSTRAINT; Schema: public; Owner: hemalathaningappakondakundi
--

ALTER TABLE ONLY public.user_progress
    ADD CONSTRAINT fk_users FOREIGN KEY (email) REFERENCES public.users(email);


--
-- PostgreSQL database dump complete
--

