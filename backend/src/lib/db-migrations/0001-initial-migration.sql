-- public.address definition

-- Drop table

-- DROP TABLE public.address;

CREATE TABLE public.address (
	id uuid NOT NULL,
	street varchar NOT NULL,
	"houseNumber" varchar NULL,
	"zipCode" varchar NOT NULL,
	city varchar NOT NULL,
	country varchar NOT NULL,
	CONSTRAINT address_pk PRIMARY KEY (id)
);